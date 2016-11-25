Rails.application.routes.draw do
  resources :carts do
    collection do
      get :owners
    end
  end
  resources :cart_items
  post "/carts/new", to: "carts#new"
  resources :products
  root to: "carts#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
