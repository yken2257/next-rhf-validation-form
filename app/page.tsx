"use client";
import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry } from "./lib/actions";

function Submit() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			className={`px-8 py-2 rounded text-white ${
				pending
					? "bg-gray-500 cursor-not-allowed"
					: "bg-blue-600 hover:bg-blue-700"
			}`}
			disabled={pending}
		>
			{pending ? "送信中..." : "送信"}
		</button>
	);
}

export default function Home() {
	const [formState, formAction] = useFormState(submitInquiry, {
		success: false,
		message: "",
	});

	return (
		<div className="max-w-md mx-auto mt-4 bg-white p-6 rounded shadow-md">
			<h1 className="text-xl font-bold mb-4">お問い合わせフォーム</h1>
			<form action={formAction}>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-600"
					>
						メールアドレス
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="content"
						className="block text-sm font-medium text-gray-600"
					>
						お問い合わせ内容
					</label>
					<textarea
						id="content"
						name="content"
						rows={4}
						required
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>
				<div className="flex justify-center">
					<Submit />
				</div>
				<div
					className={`flex justify-center mt-4 ${
						formState.success ? "" : "text-red-600"
					}`}
				>
					{formState.message}
				</div>
			</form>
		</div>
	);
}
