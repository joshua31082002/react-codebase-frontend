require "test_helper"

class HealthControllerTest < ActionDispatch::IntegrationTest
  test "returns a healthy response" do
    get "/health"

    assert_response :success
    assert_equal "ok", response.parsed_body["status"]
    assert_equal "health-api", response.parsed_body["service"]
    assert response.parsed_body["timestamp"].present?
  end
end
