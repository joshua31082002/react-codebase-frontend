require_relative "../application"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = false
  config.cache_classes = true
  config.consider_all_requests_local = true
end
