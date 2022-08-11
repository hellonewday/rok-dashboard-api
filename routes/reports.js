const Report = require("../model/Report");

const router = require("express").Router();

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

router.get("/", (req, res, next) => {
  Report.find()
    .populate({
      path: "logs",
      options: {
        limit: req.query.limit ? req.query.limit : 300,
        sort: { power: -1 },
      },
    })
    .exec((error, documents) => {
      console.log(error);
      if (error) return res.status(400).json({ success: false, error: error });
      return res.status(200).json({
        result: documents.map((item) => {
          return {
            id: item._id,
            hour: item.hour,
            day: item.day,
            year: item.year,
            month: item.month,
            logs: item.logs,
            sum: {
              powers: item.logs.reduce((total, num) => {
                return total + num.power;
              }, 0),
              kill_points: item.logs.reduce((total, num) => {
                return total + num.kill_points;
              }, 0),
              tier_1: item.logs.reduce((total, num) => {
                return total + num.tier_1;
              }, 0),
              tier_2: item.logs.reduce((total, num) => {
                return total + num.tier_2;
              }, 0),
              tier_3: item.logs.reduce((total, num) => {
                return total + num.tier_3;
              }, 0),
              tier_4: item.logs.reduce((total, num) => {
                return total + num.tier_4;
              }, 0),
              tier_5: item.logs.reduce((total, num) => {
                return total + parseInt(num.tier_5);
              }, 0),
              rss_assistance: item.logs.reduce((total, num) => {
                return total + parseInt(num.rss_assistance);
              }, 0),
            },
          };
        }),
      });
    });
});

router.get("/today", (req, res, next) => {
  let d = new Date();
  Report.find({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  })
    .populate({
      path: "logs",
      options: {
        limit: req.query.limit ? req.query.limit : 300,
        sort: { power: -1 },
      },
    })
    .sort({ hour: -1 })
    .limit(req.body.compare ? 2 : 99999)
    .exec((error, documents) => {
      console.log(error);
      if (error) return res.status(400).json({ success: false, error: error });

      let result = documents.map((item) => {
        return {
          id: item._id,
          hour: item.hour,
          day: item.day,
          year: item.year,
          month: item.month,
          logs: req.query.loggable ? item.logs : [], // statistics
          sum: req.query.summary ? {
            powers: item.logs.reduce((total, num) => {
              return total + parseInt(num.power);
            }, 0),
            kill_points: item.logs.reduce((total, num) => {
              return total + parseInt(num.kill_points);
            }, 0),
            tier_1: item.logs.reduce((total, num) => {
              return total +parseInt(num.tier_1);
            }, 0),
            tier_2: item.logs.reduce((total, num) => {
              return total + parseInt(num.tier_2);
            }, 0),
            tier_3: item.logs.reduce((total, num) => {
              return total + parseInt(num.tier_3);
            }, 0),
            tier_4: item.logs.reduce((total, num) => {
              return total + parseInt(num.tier_4);
            }, 0),
            tier_5: item.logs.reduce((total, num) => {
              return total + parseInt(num.tier_5);
            }, 0),
            rss_assistance: item.logs.reduce((total, num) => {
              return total + parseInt(num.rss_assistance);
            }, 0),
          } : {},
        };
      });
      let result_sum = result.map((item) => {
        return item.sum;
      });
      let compares = []
      
      let compare = req.query.compare && req.query.summary
        ? {
            powers: numberWithCommas(result_sum[0].powers - result_sum[1].powers),
            kill_points: numberWithCommas(result_sum[0].kill_points - result_sum[1].kill_points),
            tier_1: numberWithCommas(result_sum[0].tier_1 - result_sum[1].tier_1),
            tier_2: numberWithCommas(result_sum[0].tier_2 - result_sum[1].tier_2),
            tier_3: numberWithCommas(result_sum[0].tier_3 - result_sum[1].tier_3),
            tier_4: numberWithCommas(result_sum[0].tier_4 - result_sum[1].tier_4),
            tier_5: numberWithCommas(result_sum[0].tier_5 - result_sum[1].tier_5),
          }
        : {};

      return res.status(200).json({
        result: result,
        compare: compare,
      });
    });
});

router.get("/top/:type/:number", (req, res, next) => {
  if (req.params.number == null || req.params.type == null) {
    return res.status(400).json({
      success: false,
      message: "Invalid parameters",
    });
  }
  let sort = {};
  switch (req.params.type) {
    case "kills":
      sort.kill_points = -1;
      break;
    case "t1":
      sort.tier_1 = -1;
      break;
    case "t2":
      sort.tier_2 = -1;
      break;
    case "t4":
      sort.tier_4 = -1;
      break;
    case "t3":
      sort.tier_3 = -1;
      break;
    case "t5":
      sort.tier_5 = -1;
      break;
    case "dead":
      sort.dead = -1;
      break;
    case "rss":
      sort.rss_assistance = -1;
    default:
      break;
  }
  let options = {
    limit: req.params.number,
    sort: sort,
  };

  Report.find()
    .populate({
      path: "logs",
      options: options,
    })
    .sort({ field: "desc" })
    .limit(1)
    .exec((error, documents) => {
      if (error) return res.status(400).json({ success: false, error: error });
      return res.status(200).json({
        result: documents,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Report.findById(req.params.id)
    .populate("logs")
    .exec((error, documents) => {
      console.log(error);
      if (error) return res.status(400).json({ success: false, error: error });
      return res.status(200).json({
        result: documents,
      });
    });
});

module.exports = router;
