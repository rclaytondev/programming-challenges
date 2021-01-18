const triangle = {
	EDGE_CENTER_DISTANCE: canvas.height / 2, // distance from the center of each edge to the center; controls triangle size.
	center: new Vector(canvas.width / 2, canvas.height / 2)
};
triangle.vertices = [120, 240, 360].map(angle => triangle.center.translate(
	triangle.EDGE_CENTER_DISTANCE * Math.cos(Math.toRadians(angle)),
	triangle.EDGE_CENTER_DISTANCE * Math.sin(Math.toRadians(angle)),
));
triangle.edges = [];
triangle.vertices.forEach((vertex, i) => {
	const nextVertex = triangle.vertices[(i + 1) % triangle.vertices.length];
	triangle.edges.push(new Line(vertex, nextVertex));
	c.strokeStyle = "black";
	c.lineWidth = 3;
	c.strokeLine(vertex, nextVertex);
});

const nextLaserSegment = (laserSegment) => {
	const nextEdge = laserSegment.nextEdge ?? triangle.edges.filter(e => !laserSegment.previousEdges.includes(e)).find(e => laserSegment.line.intersectsSegment(e));
	if(!nextEdge) { return null; }
	const intersection = laserSegment.line.intersection(nextEdge);
	if(triangle.vertices.some(v => v.distanceFrom(intersection) < CORNER_HOLE_SIZE)) {
		return;
	}
	const edgeAngle = nextEdge.angle() - 180;
	const laserAngle = (laserSegment.line.angle() + 180) % 360;
	const newAngle = -reflectLasers(laserAngle, edgeAngle);
	return {
		line: new Line(
			intersection,
			intersection.add(new Vector(1, 0).rotateTo(newAngle))
		),
		previousEdges: [nextEdge]
	};
};

const CORNER_HOLE_SIZE = 1;
let previousSegments = [];
let previousMousePos = null;
let numBounces = 0;
setInterval(() => {
	const MAX_SEGMENTS = 10;
	const mouseMoved = !io.mouse.equals(previousMousePos);
	previousMousePos = io.mouse.clone();
	if(mouseMoved) {
		c.fillCanvas("white");
		c.strokeStyle = "black";
		c.strokePoly(triangle.vertices);
		previousSegments = [{
			line: new Line(new Vector(io.mouse), triangle.vertices[2]),
			nextEdge: triangle.edges[0]
		}];
		numBounces = 0;
	}
	else {
		const nextSegment = nextLaserSegment(previousSegments.lastItem());
		if(nextSegment) {
			numBounces ++;
			previousSegments.push(nextLaserSegment(previousSegments.lastItem()));
			if(previousSegments.length > MAX_SEGMENTS) {
				previousSegments.splice(0, 1);
			}
		}
	}

	c.save(); {
		c.beginPath();
		c.polygon(triangle.vertices);
		c.clip();

		previousSegments.forEach((segment, i) => {
			c.strokeStyle = utils.color.lerp("rgb(255, 0, 0)", "rgb(200, 200, 200)", 1 - ((i + 1) / previousSegments.length));
			segment.line.display(c);
		});
	} c.restore();


	c.fillStyle = "white";
	c.fillRect(0, 0, 100, 100);
	c.fillStyle = "black";
	c.font = "20px monospace";
	c.fillText(numBounces, 20, 20);
}, 100);

const reflectLasers = (laserAngle, mirrorAngle) => {
	const angleOfIncidence = laserAngle - mirrorAngle;
	return mirrorAngle - angleOfIncidence;
};
testing.addUnit("reflectLasers()", {
	"should return correct laser angle - test case 1": () => {
		const result = Math.modulateIntoRange(reflectLasers(90, 45), 0, 360);
		expect(result).toEqual(0);
	},
	"should return correct laser angle - test case 2": () => {
		const result = Math.modulateIntoRange(reflectLasers(270, 45), 0, 360);
		expect(result).toEqual(180);
	},
	"should return correct laser angle - test case 3": () => {
		const result = Math.modulateIntoRange(reflectLasers(90, 0), 0, 360); // vertical-upward laser hits horizontal mirror and bounces back
		expect(result).toEqual(270);
	},
	"should return correct laser angle - test case 4": () => {
		const result = Math.modulateIntoRange(reflectLasers(45, 0), 0, 360);
		expect(result).toEqual(315);
	},
	"should return correct laser angle - test case 5": () => {
		const result = Math.modulateIntoRange(reflectLasers(90, 135), 0, 360);
		expect(result).toEqual(180);
	},
});
