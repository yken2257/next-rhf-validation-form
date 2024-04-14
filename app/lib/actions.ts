"use server";

type State = {
	success?: boolean;
	message?: string;
};

export async function submitInquiry(prevState: State, formData: FormData) {
	const headers = new Headers([
		["Content-Type", "application/json"],
		["Authorization", `Bearer ${process.env.SENDGRID_API_KEY}`],
	]);
	const requestBody = {
		personalizations: [
			{
				to: [
					{
						email: formData.get("email"),
					},
				],
			},
		],
		subject: "お問い合わせを受け付けました。",
		from: {
			email: "from@example.com",
		},
		content: [
			{
				type: "text/plain",
				value: `以下の内容でお問い合わせを受け付けました。\r\n------\r\n${formData.get(
					"content",
				)}`,
			},
		],
	};
	try {
		const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: headers,
			body: JSON.stringify(requestBody),
		});
		if (response.ok) {
			return {
				success: true,
				message: "お問い合わせを受け付けました。",
			};
		}
		return {
			success: false,
			message: "お問い合わせの送信に失敗しました。",
		};
	} catch (e) {
		return {
			success: false,
			message: "お問い合わせの送信に失敗しました。",
		};
	}
}
