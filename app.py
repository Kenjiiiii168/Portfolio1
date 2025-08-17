from flask import Flask, render_template, session, redirect, url_for, request, jsonify
import json

app = Flask(__name__)
app.secret_key = "supersecretkey123"

with open('products.json', encoding='utf-8') as f:
    products = json.load(f)

def get_product(pid):
    for p in products:
        if p['id'] == pid:
            return p
    return None

@app.route('/')
def index():
    return render_template('index.html', products=products)

@app.route('/promotions')
def promotions():
    promo_products = [p for p in products if p.get("promo")]  # กรองเฉพาะที่ promo ไม่ว่าง
    return render_template('promotions.html', products=promo_products)


@app.route('/add_to_cart/<int:product_id>')
def add_to_cart(product_id):
    if 'cart' not in session:
        session['cart'] = {}
    cart = session['cart']
    pid_str = str(product_id)
    if pid_str in cart:
        cart[pid_str] += 1
    else:
        cart[pid_str] = 1
    session['cart'] = cart
    return redirect(url_for('index'))

@app.route('/cart')
def cart():
    cart_items = []
    total = 0
    if 'cart' in session:
        for pid_str, qty in session['cart'].items():
            p = get_product(int(pid_str))
            if p:
                item = p.copy()
                item['qty'] = qty
                item['subtotal'] = qty * p['price']
                cart_items.append(item)
                total += item['subtotal']
    return render_template('cart.html', cart_items=cart_items, total=total)

@app.route('/update_cart', methods=['POST'])
def update_cart():
    data = request.json  # { "1":2, "3":1 } pid:qty
    session['cart'] = {k:str(v) for k,v in data.items()}
    session.modified = True
    return jsonify({"status":"success"})

@app.route('/clear_cart')
def clear_cart():
    session.pop('cart', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
