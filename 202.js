const drawLaserSimulation = (mousePos, numReflections) => {
	const triangleCenter = new Vector(canvas.width / 2, canvas.height / 2);
	const EDGE_CENTER_DISTANCE = canvas.height / 2; // distance from the center of each edge to the center; controls triangle size.
	/* v1 = bottom-left vertex, v2 = top-left vertex, v3 = right vertex. */
	const [v1, v2, v3] = [120, 240, 360].map(angle => triangleCenter.translate(
		EDGE_CENTER_DISTANCE * Math.cos(Math.toRadians(angle)),
		EDGE_CENTER_DISTANCE * Math.sin(Math.toRadians(angle)),
	));
	c.strokeStyle = "rgb(150, 150, 150)";
	c.lineWidth = 3;
	c.strokeLine(v1, v2);
	c.strokeLine(v2, v3);
	c.strokeLine(v3, v1);
	const [edge1, edge2, edge3] = [
		new Line(v1, v2), // left edge
		new Line(v2, v3), // top-right edge
		new Line(v3, v1) // bottom-right edge
	];

	const laserSegments = [{
		line: new Line(mousePos, v3),
		nextEdges: [edge1]
	}];
	let leftTriangle = false;
	while(laserSegments.length < numReflections) {
		const segment = laserSegments.lastItem();
		if(!segment.nextEdges) {
			segment.nextEdges = [edge1, edge2, edge3].filter(e => !segment.previousEdges.includes(e));
		}
		const nextEdge = segment.nextEdges.find(e => segment.line.intersectsSegment(e));
		if(!nextEdge) {
			break;
		}
		const intersection = segment.line.intersection(nextEdge);
		const VERTEX_HOLE_SIZE = 3;
		if(intersection.distanceFrom(v3) < VERTEX_HOLE_SIZE) {
			leftTriangle = true;
			break;
		}

		c.fillStyle = "red";
		c.fillCircle(intersection.x, intersection.y, 5);
		const laserAngle = (segment.line.angle() + 180) % 360;
		const mirrorAngle = nextEdge.angle() - 180;
		const newAngle = -reflectLasers(laserAngle, mirrorAngle);
		laserSegments.push({
			line: new Line(
				intersection,
				intersection.add(new Vector(1, 0).rotateTo(newAngle))
			),
			previousEdges: [nextEdge]
		});
	}
	c.strokeStyle = "red";
	c.save(); {
		c.beginPath();
		c.polygon(v1, v2, v3);
		c.clip();

		laserSegments.forEach((segment, i) => {
			segment.line.display(c);
		});
	} c.restore();
};

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

setInterval(() => {
	c.fillCanvas("white");
	drawLaserSimulation(io.mouse, 30);
}, 1000 / 30);
// testing.testUnit("reflectLasers()");
