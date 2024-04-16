"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sendEmail, validateEmail } from "./actions";
import { type Inquiry, schema } from "./types";

export default function Contact() {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<Inquiry>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});
	const onSubmit = handleSubmit(async (data) => {
		// Email Validation APIを使ってメールアドレスの形式をチェック
		const validation = await validateEmail(data.email);
		if (validation.warning) {
			const ignoreWarn = confirm(validation.warning);
			if (!ignoreWarn) {
				setError("email", { type: "cancel", message: "修正してください" });
				return;
			}
		}
		// メール送信
		const sendemail = await sendEmail(data);
		if (!sendemail.success) {
			setError("root", { type: "apiError", message: "送信に失敗しました" });
			return;
		}
		reset();
	});
	return (
		<div className="max-w-md mx-auto mt-4 bg-white p-6 rounded shadow-md">
			<h1 className="text-xl font-bold mb-4">お問い合わせフォーム</h1>
			<form onSubmit={onSubmit}>
				<div className="mb-4">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-600"
					>
						お名前
					</label>
					<input
						id="name"
						className="mt-1 p-2 w-full border rounded-md"
						{...register("name")}
					/>
					{typeof errors.name?.message === "string" && (
						<p className="text-red-500 text-sm">{errors.name.message}</p>
					)}
				</div>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-600"
					>
						メールアドレス
					</label>
					<input
						id="email"
						type="email"
						className="mt-1 p-2 w-full border rounded-md"
						{...register("email")}
					/>
					{typeof errors.email?.message === "string" && (
						<p className="text-red-500 text-sm">{errors.email.message}</p>
					)}
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
						rows={4}
						className="mt-1 p-2 w-full border rounded-md"
						{...register("content")}
					/>
					{typeof errors.content?.message === "string" && (
						<p className="text-red-500 text-sm">{errors.content.message}</p>
					)}
				</div>
				<div className="flex justify-center">
					<button
						type="submit"
						className={`px-8 py-2 rounded text-white ${
							isSubmitting
								? "bg-gray-500 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
					>
						{isSubmitting ? "送信中..." : "送信"}
					</button>
				</div>
			</form>
			{isSubmitSuccessful && (
				<div className="flex flex-col items-center justify-center mt-4">
					<p>お問い合わせを受け付けました。</p>
					<p>自動返信メールをご確認ください。</p>
				</div>
			)}
			{typeof errors.root?.message === "string" && (
				<p className="flex justify-center text-red-500 mt-4">
					{errors.root.message}
				</p>
			)}
		</div>
	);
}
