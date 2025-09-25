// // app/api/serviceType/route.js
// import dbConnect from "../../helper/db";
// import ServiceType from "../../helper/models/Servicetype";

// // GET all service types
// export async function GET(req) {
//   await dbConnect();
//   const serviceTypes = await ServiceType.find();
//   return new Response(JSON.stringify(serviceTypes), { status: 200 });
// }

// // POST create new service type
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const serviceType = new ServiceType(body);
//     await serviceType.save();
//     return new Response(JSON.stringify(serviceType), { status: 201 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: error.message }), { status: 400 });
//   }
// }

// // PATCH update load size or postcode-specific prices
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const { serviceId, loadSizeId, defaultPrice, postcodeOverrides } = body;

//     const service = await ServiceType.findById(serviceId);
//     if (!service) return new Response(JSON.stringify({ message: "Service not found" }), { status: 404 });

//     const load = service.loadSizes.id(loadSizeId);
//     if (!load) return new Response(JSON.stringify({ message: "Load size not found" }), { status: 404 });

//     if (defaultPrice !== undefined) load.defaultPrice = defaultPrice;
//     if (postcodeOverrides) load.postcodeOverrides = postcodeOverrides;

//     await service.save();
//     return new Response(JSON.stringify(service), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: error.message }), { status: 400 });
//   }
// }
