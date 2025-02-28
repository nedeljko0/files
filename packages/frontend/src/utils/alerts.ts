export const showAlert = (message: string, isError = false) => {
	const alert = document.createElement("div");
	alert.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
		isError ? "bg-red-500" : "bg-green-500"
	} text-white text-sm z-50 transition-opacity duration-300`;
	alert.textContent = message;
	document.body.appendChild(alert);

	setTimeout(() => {
		alert.style.opacity = "0";
		setTimeout(() => {
			document.body.removeChild(alert);
		}, 300);
	}, 3000);
};
