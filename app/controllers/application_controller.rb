class ApplicationController < ActionController::Base
  http_basic_authenticate_with name: ENV["ADMIN_USERNAME"] || 'admin', password: ENV["ADMIN_PASSWORD"] || 'admin'
  protect_from_forgery with: :exception
end
