class ApplicationController < ActionController::Base
  http_basic_authenticate_with name: ENV["ADMIN_USERNAME"], password: ENV["ADMIN_PASSWORD"]
  protect_from_forgery with: :exception
end
