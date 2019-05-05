

$('#button').on('click',function () {
  let data =  $(this).val() ;
  console.log(data, ' detail.js L- 5');
  window.location.href = `/details/${data}`;
  
});

