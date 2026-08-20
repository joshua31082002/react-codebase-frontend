require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module HealthApi
  class Application < Rails::Application
    config.load_defaults 8.1
    config.api_only = true
    config.eager_load = ENV["RAILS_ENV"] == "production"
  end
end
