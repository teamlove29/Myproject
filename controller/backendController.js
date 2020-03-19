const con = require('./conDB')


const main = async (req, res) => {
  const sqlUser = "SELECT * FROM `user`"
  const sqlActivity = "SELECT * FROM `activity`"
  const sqlResource = "SELECT * FROM `resource`"
  const Nwdate = new Date
  const yearNow = Nwdate.getFullYear() + 543
  const StartYear = yearNow + '-01-01'
  const EndYear = yearNow + '-12-31'
  
  const sqlDate = "SELECT * FROM `activity` WHERE `actDate` between ? AND ? "
  con.query(sqlUser, async (err, responUser) => {
    let resultArea = {}
    await responUser.map(value => {
      resultArea[value.userArea] ? resultArea[value.userArea]++ : resultArea[value.userArea] = 1
    })
    // console.log(result);
    con.query(sqlDate,[StartYear,EndYear], async(err,responDate) => {
      let resultAct = {}
      await responDate.map(value => {
        const date = value.actDate
        const mm = date.getMonth() + 1
        resultAct[mm] ? resultAct[mm]++ : resultAct[mm] = 1
      })
      var January,February,March,April,May,June,July,August,September,October,November,December
      resultAct = [resultAct]
      resultAct.map(async (value,index)  => {

        January = await value[1] ? value[1] : 0
         February  = await value[2] ? value[2] : 0
         March  = await value[3]  ? value[3] : 0
         April  = await value[4]? value[4] : 0
         May  = await value[5] ? value[5] : 0
         June  = await value[6]  ? value[6] : 0
         July  = await value[7] ? value[7] : 0
         August  = await value[8] ? value[8] : 0
         September  = await value[9]  ? value[9] : 0
         October  = await value[10]  ? value[10] : 0
         November  = await value[11]  ? value[11] : 0
         December   = await value[12]  ? value[12] : 0
        })
   
    con.query(sqlActivity, async (err, responActivity) => {
      con.query(sqlResource, (err, responResource) => {  
        res.render("page/backend/main", {
          Months: {
            yearNow:yearNow,
            January:January,
            February:February,
            March:March,
            April:April,
            May:May,
            June:June,
            July:July,
            August:August,
            September:September,
            October:October,
            November:November,
            December:December
          },
          name: req.session.username,
          user: responUser,
          activity: responActivity,
          resource: responResource,
          data: {
            dashboard: true,
            managerUser: false,
            managerActivity: false,
            managerResource: false
          }
        })
      })
    })
  })
})

}

const notFound = (req, res) => {
  if (req.session.status === 'admin') {
    res.render("404", {
      data: {
        admin: true,
        user: false
      }
    })
  } else {
    res.render("404", {
      data: {
        admin: false,
        user: true
      }
    })
  }
}


const test = (req, res) => {
  res.render('page/test')
  console.log('test');
  
}

module.exports.test = test
module.exports.main = main
module.exports.notFound = notFound