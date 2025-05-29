import {normal, power_slugs} from "@public/images";
import {Building} from "@/lib/buildings";


export function getSize(location: { x: number; y: number; z: number; rotation: number }, building: Building)
{
	let width = building.length * 100;
	let length = building.width * 100;

	let x = location.x;
	let y = location.y * -1;
	let rotation = location.rotation;

	const points = [
		[
			x - width / 2,
			y + length / 2
		],
		[
			x + width / 2,
			y + length / 2
		],
		[
			x + width / 2,
			y - length / 2
		],
		[
			x - width / 2,
			y - length / 2
		]
	];

	const radians = (rotation * Math.PI) / 180;

	function rotatePoint(px: number, py: number)
	{
		const rotatedX = x + (px - x) * Math.cos(radians) - (py - y) * Math.sin(radians);
		const rotatedY = y + (px - x) * Math.sin(radians) + (py - y) * Math.cos(radians);
		return [
			rotatedX,
			rotatedY
		];
	}

	return points.map((point) => rotatePoint(point[0], point[1]));
}

export const layerStuff = {
	player: {
		icon: normal.player.alive,
		label: "Players"
	},
	hub: {
		icon: normal.hub,
		label: "Hub"
	},
	radar: {
		icon: normal.radar_tower,
		label: "Radio Towers"
	},
	train: {
		icon: normal.vehicles.trains.train,
		label: "Trains"
	},
	train_station: {
		icon: normal.vehicles.trains.train_station,
		label: "Train Stations"
	},
	drone: {
		icon: normal.drones.drone,
		label: "Drones"
	},
	drone_station: {
		icon: normal.drones.drone_station,
		label: "Drone Stations"
	},
	truck_station: {
		icon: normal.vehicles.trucks.truck_station,
		label: "Truck Stations"
	},
	space: {
		icon: normal.space_elevator,
		label: "Space Elevator"
	},
	vehicles: {
		icon: normal.vehicles.trucks.truck,
		label: "Vehicles"
	},
	slugs: {
		icon: power_slugs.power_slug,
		label: "Slug"
	},
	cables: {
		icon: normal.power,
		label: "Cables"
	},
	factory: {
		icon: normal.question_mark,
		label: "Factory"
	},
	generators: {
		icon: normal.power,
		label: "Power Generators"
	},
	drop: {
		icon: normal.drop_pod,
		label: "Drop Pods"
	},
	resource_well: {
		icon: normal.question_mark,
		label: "Resource Wells"
	},
	resource_node: {
		icon: normal.question_mark,
		label: "Resource Nodes"
	},
	belts: {
		icon: normal.question_mark,
		label: "Belts"
	}
};
