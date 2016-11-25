class ChangeDefaultCurrencyFromProducts < ActiveRecord::Migration[5.0]
  def change
    change_column :products, :price_currency, :string, default: "BRL"
  end
end
