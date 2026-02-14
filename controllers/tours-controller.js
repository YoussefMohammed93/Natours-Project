const fs = require("fs");
const path = require("path");

const tours = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "..",
      "dev-data",
      "data",
      "tours-simple.json"
    ),
    "utf-8"
  )
);

exports.checkId = (req, res, next, val) => {
  const tourId = Number(req.params.id);
  const tour = tours.find(element => element.id === tourId);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found"
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const tourId = Number(req.params.id);
  const tour = tours.find(element => element.id === tourId);

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    path.join(
      __dirname,
      "..",
      "dev-data",
      "data",
      "tours-simple.json"
    ),
    JSON.stringify(tours),
    err => {
      if (err) console.error(err);

      res.status(201).json({
        status: "success",
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>"
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null
  });
};
