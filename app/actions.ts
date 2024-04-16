"use server";
import type { Inquiry } from "./types";

// SendGrid Email Validation API
export async function validateEmail(
	email: string,
): Promise<{ warning: string | null }> {
	try {
		const response = await fetch(
			"https://api.sendgrid.com/v3/validations/email",
			{
				headers: {
					Authorization: `Bearer ${process.env.SENDGRID_VALIDATION_KEY}`,
				},
				method: "POST",
				body: JSON.stringify({
					email: email,
					source: "inquiry",
				}),
			},
		);
		const data = await response.json();
		console.log(JSON.stringify(data, null, 2));
		if (response.ok) {
			let warning = null;
			if (data.result.suggestion) {
				const suggestedEmail = `${data.result.local}@${data.result.suggestion}`;
				warning = `メールアドレスは${suggestedEmail}ではありませんか？${data.result.email}のまま送信する場合はOKを押してください。`;
			} else if (data.result.checks.domain.has_mx_or_a_record === false) {
				warning = `「${data.result.email}」にタイプミスはありませんか？メールが届かない恐れがあります。このまま送信する場合はOKを押してください。`;
			}
			return { warning };
		}
		return { warning: null };
	} catch (e) {
		console.error(e);
		return { warning: null };
	}
}

// SendGrid mail send API
export async function sendEmail(
	inquiry: Inquiry,
): Promise<{ success: boolean }> {
	try {
		const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				personalizations: [
					{
						to: [
							{
								email: "null@sink.sendgrid.net", //inquiry.email,
								name: inquiry.name,
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
						value: `以下の内容でお問い合わせを受け付けました。\r\n------\r\n${inquiry.content}`,
					},
				],
			}),
		});
		if (response.ok) {
			console.log(response.status, response.statusText);
			return { success: true };
		}
		console.error(response.status, response.statusText);
		return { success: false };
	} catch (e) {
		console.error(e);
		return { success: false };
	}
}
