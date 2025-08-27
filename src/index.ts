import { Hono } from "hono";
import { cors } from "hono/cors";

import Get from "./routes/get";
// import Patch from "./routes/patch";  // Commented out - list files API
import Put from "./routes/put";
// import Delete from "./routes/delete";  // Commented out - delete files API

import MpuCreate from "./routes/mpu/create";
import MpuParts from "./routes/mpu/parts";
// import MpuAbort from "./routes/mpu/abort";  // Commented out - abort multipart upload API
import MpuComplete from "./routes/mpu/complete";
import MpuSupport from "./routes/mpu/support";

import checkHeader from "./middleware/checkHeader";

const app = new Hono<{
	Bindings: {
		R2_BUCKET: R2Bucket;
	};
}>();

app.use(cors());
app.get("/support_mpu", MpuSupport);
app.get("/", (c) => c.text("Hello R2! v2025.01.13"));
app.use("*", checkHeader);

// multipart upload operations
app.post("/mpu/create/:key{.*}", MpuCreate);
app.put("/mpu/:key{.*}", MpuParts);
// app.delete("/mpu/:key{.*}", MpuAbort);  // Commented out - abort multipart upload
app.post("/mpu/complete/:key{.*}", MpuComplete);

// normal r2 operations
app.get("/:key{.*}", Get); // Keep - read files API
// app.patch("/", Patch);  // Commented out - list files API
app.put("/:key{.*}", Put); // Keep - upload files API
// app.delete("/:key{.*}", Delete);  // Commented out - delete files API

app.all("*", (c) => {
	return c.text("404 Not Found");
});

export default app;
