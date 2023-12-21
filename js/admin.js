let orderData = [];
const jsOrderList = document.querySelector('.js-orderList');

function init(){
  getOrderList();
}

init();

function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token,
        },
      }
    )
    .then(function (res) {
      orderData = res.data.orders;
      let str = '';
      orderData.forEach(function(item){
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
              <p></p>
            </td>
            <td>${item.createdAt}</td>
            <td class="orderStatus">
              <a href="#">${item.paid}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
            </td>
        </tr>
        `
      })
      jsOrderList.innerHTML = str;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 刪除單筆訂單
jsOrderList.addEventListener('click',function(e){
  e.preventDefault();
  let orderId = e.target.getAttribute('data-id');
  if(orderId === null){
    return;
  }
  deleteOrderItem(orderId);
  
})

function deleteOrderItem(id) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,{
    headers: {
      'Authorization': token,
    },
  })
  .then(function(res){
    alert('已成功刪除該筆訂單');
    getOrderList();
  })
}