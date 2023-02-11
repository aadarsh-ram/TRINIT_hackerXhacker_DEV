
export const dataFetch = async (
	url,
	method = "POST",
	body = JSON.stringify({})
) => {
	var headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
	};
	const response = await fetch(`http://localhost:4000${url}`, {
		method,
		headers,
		body: body,
	});
	return response;
};