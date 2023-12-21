let orderData = [];
const jsOrderList = document.querySelector('.js-orderList');

function init() {
  getOrderList();
}

init();

function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          "Authorization": token,
        },
      }
    )
    .then(function (res) {
      orderData = res.data.orders;
      // 組訂單字串
      let str = '';
      orderData.forEach(function (item) {
        // 判斷訂單處理狀態
        let orderStatus = '';
        if (item.paid === true) {
          orderStatus = '已處理';
        } else {
          orderStatus = '未處理';
        }
        // 組產品字串
        let productStr = '';
        let orderProducts = item.products;
        orderProducts.forEach(function (productItem) {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`;
        });
        str += `
        <tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              ${productStr}
            </td>
            <td>${item.createdAt}</td>
            <td>
              <a href="#" class="js-orderStatus" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
            </td>
        </tr>
        `;
      });
      jsOrderList.innerHTML = str;
    })
    .catch(function (error) {
      console.log(error);
    });
}

jsOrderList.addEventListener('click', function (e) {
  e.preventDefault();
  const orderId = e.target.getAttribute('data-id');
  const targetClass = e.target.getAttribute('class');

  // 改變處理狀態
  if (targetClass === 'js-orderStatus') {
    let status = e.target.getAttribute('data-status');
    changeOrderStatus(status, orderId);
    return;
  }
  // 刪除單筆訂單
  if (targetClass === 'delSingleOrder-Btn js-orderDelete') {
    deleteOrderItem(orderId);
    return;
  }
});

function changeOrderStatus(status, id) {
  let newStatus;
  if (status === 'true') {
    newStatus = false;
  } else {
    newStatus = true;
  }
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        'data': {
          'id': id,
          'paid': newStatus,
        },
      },
      {
        headers: {
          'Authorization': token,
        },
      }
    )
    .then(function (res) {
      alert('修改訂單狀態成功');
      getOrderList();
    }).catch(function(error){
      console.log(error);
    })
}

function deleteOrderItem(id) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
      {
        headers: {
          'Authorization': token,
        },
      }
    )
    .then(function (res) {
      alert('已成功刪除該筆訂單');
      getOrderList();
    });
}
