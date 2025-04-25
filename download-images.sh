#!/bin/bash

# Create directories
mkdir -p public/images/categories
mkdir -p public/images/products

# Download category images
cd public/images/categories
curl -o spices.jpg https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80
curl -o grains.jpg https://images.unsplash.com/photo-1586201375761-83865001e8d6?w=800&q=80
curl -o sauces.jpg https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80
curl -o snacks.jpg https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80
curl -o bundles.jpg https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80
cd -

# Download product images
cd public/images/products
curl -o pepper-mix.jpg https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80
curl -o jollof-spice.jpg https://images.unsplash.com/photo-1599438245301-173ce6a803c5?w=800&q=80
curl -o ogbono.jpg https://images.unsplash.com/photo-1508747323945-2a6097fce5bd?w=800&q=80
curl -o crayfish.jpg https://images.unsplash.com/photo-1626082896492-766af4eb6501?w=800&q=80
curl -o ofada-rice.jpg https://images.unsplash.com/photo-1586201375761-83865001e8d6?w=800&q=80
curl -o egusi.jpg https://images.unsplash.com/photo-1556910633-5099dc3971e0?w=800&q=80
curl -o plantain-chips.jpg https://images.unsplash.com/photo-1559471712-e29bb872c2fa?w=800&q=80
curl -o suya-spice.jpg https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=800&q=80
cd -

echo "Images downloaded successfully!"