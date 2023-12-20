const productWrap = document.querySelector('.productWrap');
let productData = [];
const productSelect = document.querySelector('.productSelect');

productSelect.addEventListener('change', function (e) {
  const category = e.target.value;
  if (category == '全部') {
    renderProductList();
    return;
  }
  let str = '';
  productData.forEach(function (item) {
    if (item.category == category) {
      str += composeProductHTMLString(item);
    }
  });
  productWrap.innerHTML = str;
});

// 預設網頁一載入執行那些函式
function init() {
  getProductList();
  getCartList();
}

init();

function composeProductHTMLString(item) {
  return `
  <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
  </li>`;
}

function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (res) {
      productData = res.data.products;
      // console.log(productData);
      renderProductList();
    });
}

function renderProductList() {
  let str = '';
  productData.forEach(function (item) {
    str += composeProductHTMLString(item);
  });
  productWrap.innerHTML = str;
}

let cartData = [];
// 點擊到加入購物車時取得id
productWrap.addEventListener('click', function (e) {
  e.preventDefault();
  const addCardClass = e.target.getAttribute('class');
  if (addCardClass !== 'addCardBtn') {
    return;
  }
  const productId = e.target.getAttribute('data-id');
  let numCheck = 1;

  cartData.forEach(function (item) {
    if (item.product.id === productId) {
      numCheck = item.quantity += 1; //寫++沒成功!
    }
  });

  addCartItem(productId, numCheck);
});

// 加入購物車
function addCartItem(id, num) {
  axios
    .post(
      'https://livejs-api.hexschool.io/api/livejs/v1/customer/santu/carts',
      {
        data: {
          productId: id,
          quantity: num,
        },
      }
    )
    .then(function (res) {
      alert('加入成功');
      getCartList();
    });
}

// 取得購物車
const cartList = document.querySelector('.shoppingCart-tableBody');
function getCartList() {
  axios
    .get('https://livejs-api.hexschool.io/api/livejs/v1/customer/santu/carts')
    .then(function (res) {
      const jsTotal = document.querySelector('.js-total');
      jsTotal.textContent = res.data.finalTotal;
      cartData = res.data.carts;
      if (cartData.length === 0) {
        cartList.innerHTML = `<tr><td></td>
        <td>目前無任何品項</td></tr>`;
        return;
      }
      let str = '';
      cartData.forEach(function (item) {
        str += `<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.product.price * item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${item.id}">
                            clear
                        </a>
                    </td>
                </tr>`;
      });
      cartList.innerHTML = str;
    });
}

// 刪除單筆
cartList.addEventListener('click', function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute('data-id');
  if (cartId === null) {
    return;
  }
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/santu/carts/${cartId}`
    )
    .then(function (res) {
      alert('刪除單筆購物車成功');
      getCartList();
    });
});

// 清除購物車全部
const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', deleteAllCardList);

function deleteAllCardList(e) {
  e.preventDefault();
  axios
    .delete(
      'https://livejs-api.hexschool.io/api/livejs/v1/customer/santu/carts'
    )
    .then(function (res) {
      alert('刪除全部購物車成功');
      getCartList();
    })
    .catch(function (error) {
      alert('購物車已清空，請勿重複點擊');
    });
}

// 送出訂單
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (cartData.length === 0) {
    alert('請加入購物車');
    return;
  }
  const customerName = document.querySelector('#customerName').value;
  const customerPhone = document.querySelector('#customerPhone').value;
  const customerEmail = document.querySelector('#customerEmail').value;
  const customerAddress = document.querySelector('#customerAddress').value;
  const tradeWay = document.querySelector('#tradeWay').value;
  if (
    customerName == '' ||
    customerPhone == '' ||
    customerEmail == '' ||
    customerAddress == '' ||
    tradeWay == ''
  ) {
    alert('請填寫資料');
    return;
  }
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: customerName,
            tel: customerPhone,
            email: customerEmail,
            address: customerAddress,
            payment: tradeWay,
          },
        },
      }
    )
    .then(function (res) {
      alert('訂單建立成功');
      document.querySelector('#customerName').value = '';
      document.querySelector('#customerPhone').value = '';
      document.querySelector('#customerEmail').value = '';
      document.querySelector('#customerAddress').value = '';
      document.querySelector('#tradeWay').value = 'ATM';
      getCartList();
    });
});

const customerEmail = document.querySelector('#customerEmail');
customerEmail.addEventListener('blur', function (e) {
  if (validateEmail(customerEmail.value) == false) {
    document.querySelector(`[data-message="Email"]`).textContent =
      '請填寫正確的Email格式';
    return;
  } else {
    document.querySelector(`[data-message="Email"]`).textContent = '';
  }
});

const customerPhone = document.querySelector('#customerPhone');
customerPhone.addEventListener('blur', function (e) {
  if (validatePhone(customerPhone.value) == false) {
    document.querySelector(`[data-message="電話"]`).textContent =
      '請填寫正確的電話格式';
  } else {
    document.querySelector(`[data-message="電話"]`).textContent = '';
  }
});

// utility js
function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function validatePhone(phone) {
  if (/^[09]{2}\d{8}$/.test(phone)) {
    return true;
  }
  return false;
}
