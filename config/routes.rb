Rails.application.routes.draw do
  resources :carts do
    collection do
      get :owners
    end
  end
  resources :products
  root to: "carts#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
