const Tour = require("../models/tour-model");
const APIFeatures = require("./../utils/api-features");

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields();

    await features.paginate();

    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with this id"
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with this id"
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(
      req.params.id
    );

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with this id"
      });
    }

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.aliasTopTours = async (req, res, next) => {
  req.query = {
    ...req.query,
    limit: "5",
    sort: "-ratingsAverage,price",
    fields: "name,price,ratingsAverage,summary,difficulty"
  };

  next();
};

exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {
            $gte: 4.5
          }
        }
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          toursNum: {
            $sum: 1
          },
          ratingsNum: {
            $sum: "$ratingsQuantity"
          },
          ratingAverage: {
            $avg: "$ratingsAverage"
          },
          priceAverage: {
            $avg: "$price"
          },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: {
          priceAverage: 1
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {
          numTourStarts: -1
        }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};
