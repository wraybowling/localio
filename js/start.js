var dr = dr || {};

var canvasElement = document.getElementById("mapCanvas");
dr.aw = canvasElement.getContext("2d");

dr.aw.beginPath();
dr.aw.arc(centerX, centerY, canvasElement.width/2, 0, 2 * Math.PI, false);
dr.aw.fillStyle = "#8ED6FF";
dr.aw.fill();
dr.aw.lineWidth = 5;
dr.aw.strokeStyle = "black";
dr.aw.stroke();
