require_relative "boot"

require "rails"
require "action_controller/railtie"
require "action_view/railtie"
require "active_job/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "active_storage/engine"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module HealthApp
  class Application < Rails::Application
    config.load_defaults 8.1
    config.eager_load = false
    config.api_only = false
  end
end
