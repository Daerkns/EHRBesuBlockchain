#!/bin/bash

# End-to-End Test Script for EHR Blockchain System
echo "Running End-to-End Tests for EHR Blockchain System"
echo "=================================================="

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Define API endpoints
API_GATEWAY="http://localhost:3000"
AUTH_SERVICE="http://localhost:4000"
HOSPITAL1_NODE="http://localhost:8545"

# Test counter
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
  local test_name=$1
  local command=$2
  local expected_status=$3
  
  echo -e "\n${YELLOW}Running test: ${test_name}${NC}"
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  
  # Run the command and capture output and status
  output=$(eval $command 2>&1)
  status=$?
  
  # Check if the status matches expected
  if [ $status -eq $expected_status ]; then
    echo -e "${GREEN}✓ Test passed${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗ Test failed${NC}"
    echo -e "${RED}Expected status: $expected_status, Got: $status${NC}"
    echo -e "${RED}Output: $output${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# Function to test an HTTP endpoint
test_endpoint() {
  local test_name=$1
  local url=$2
  local expected_status_code=$3
  local method=${4:-GET}
  local data=${5:-""}
  
  echo -e "\n${YELLOW}Testing endpoint: ${test_name} (${method} ${url})${NC}"
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  
  # Build curl command
  curl_cmd="curl -s -o /dev/null -w '%{http_code}' -X ${method}"
  
  # Add data if provided
  if [ ! -z "$data" ]; then
    curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
  fi
  
  # Add URL
  curl_cmd="$curl_cmd ${url}"
  
  # Run curl and get status code
  status_code=$(eval $curl_cmd)
  
  # Check if status code matches expected
  if [ "$status_code" -eq "$expected_status_code" ]; then
    echo -e "${GREEN}✓ Endpoint test passed (Status: $status_code)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗ Endpoint test failed${NC}"
    echo -e "${RED}Expected status: $expected_status_code, Got: $status_code${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

echo -e "\n${YELLOW}Step 1: Testing if services are running${NC}"

# Test if API Gateway is running
test_endpoint "API Gateway Health Check" "${API_GATEWAY}/health" 200

# Test if Auth Service is running
test_endpoint "Auth Service Health Check" "${AUTH_SERVICE}/health" 200

# Test if Blockchain Node is running
run_test "Blockchain Node Check" "curl -s -X POST -H 'Content-Type: application/json' --data '{\"jsonrpc\":\"2.0\",\"method\":\"net_version\",\"params\":[],\"id\":1}' ${HOSPITAL1_NODE} | grep -q 'result'" 0

echo -e "\n${YELLOW}Step 2: Testing Authentication${NC}"

# Test user registration
test_endpoint "User Registration" "${API_GATEWAY}/api/auth/register" 201 "POST" '{"username":"testuser","password":"password123","name":"Test User","email":"test@example.com","role":"patient"}'

# Test user login
test_endpoint "User Login" "${API_GATEWAY}/api/auth/login" 200 "POST" '{"username":"testuser","password":"password123"}'

echo -e "\n${YELLOW}Step 3: Testing Monitoring${NC}"

# Test services monitoring endpoint
test_endpoint "Services Monitoring" "${API_GATEWAY}/api/monitor/services" 401

# Test nodes monitoring endpoint
test_endpoint "Nodes Monitoring" "${API_GATEWAY}/api/monitor/nodes" 401

echo -e "\n${YELLOW}Step 4: Testing Frontend Availability${NC}"

# Test if patient portal is accessible
run_test "Patient Portal Static Files" "ls -la frontend/patient-portal/public/index.html" 0

# Test if doctor dashboard is accessible
run_test "Doctor Dashboard Static Files" "ls -la frontend/doctor-dashboard/public/index.html" 0

# Print test summary
echo -e "\n${YELLOW}Test Summary${NC}"
echo -e "Total tests: ${TESTS_TOTAL}"
echo -e "${GREEN}Tests passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Tests failed: ${TESTS_FAILED}${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed! The EHR Blockchain System is working correctly.${NC}"
  exit 0
else
  echo -e "\n${RED}Some tests failed. Please check the system configuration.${NC}"
  exit 1
fi
