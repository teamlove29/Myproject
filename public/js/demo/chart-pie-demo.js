



// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Prompt,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var data = {
  Area : [{"userArea":"เมืองลำปาง"},{"userArea":"เมืองลำปาง"},{"userArea":"เมืองลำปาง"},{"userArea":"เกาะคา"},{"userArea":"แจ้ห่ม"},{"userArea":"เมืองลำปาง"}]
}
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["จุดเมือง", "สบปราบ", "เกาะคา", "แม่เมาะ", "นิคมพัฒนา", "เมืองปาน", "แม่ตุ๋ย"],
    datasets: [{
      data: [77, 10, 10, 10,10,10,10],
      backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#FF82AB', '#800080', '#FFCC99'],
    }],
  },
});




$.ajax({
  dataType: 'json',
  url: '/Area',
  data: data,
  success: success
});

console.log(data);
