require "test_helper"

class HealthControllerTest < ActionDispatch::IntegrationTest
  test "returns a healthy status" do
    get "/health"

    assert_response :success
    assert_equal "application/json; charset=utf-8", response.content_type
    assert_equal({ "status" => "ok" }, JSON.parse(response.body))
  end
end
