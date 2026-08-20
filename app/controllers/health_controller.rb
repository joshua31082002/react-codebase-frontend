class HealthController < ActionController::API
  def show
    render json: {
      status: "ok",
      service: "health-api",
      timestamp: Time.current.iso8601
    }
  end
end
