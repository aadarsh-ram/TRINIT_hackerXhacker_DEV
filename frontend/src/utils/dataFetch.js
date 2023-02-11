
export const dataFetch = async (
	url,
	method = "POST",
	body
) => {
	var headers = {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${localStorage.getItem("ecotrack-token")}`,
	};
	fetch(`http://localhost:8000${url}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${localStorage.getItem("ecotrack-token")}`,
		},
		body: JSON.stringify(body),
	}).then(async(res)=>{
		let response = (await res.json())
		return response
	}).catch(e =>console.log(e))
};