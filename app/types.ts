import { z } from "zod";

export const schema = z.object({
	name: z
		.string({ required_error: "入力必須です" })
		.min(2, { message: "2文字以上で入力してください" }),
	email: z
		.string({ required_error: "入力必須です" })
		.email({ message: "メールアドレスの形式が正しくありません" }),
	content: z
		.string({ required_error: "入力必須です" })
		.min(2, { message: "2文字以上で入力してください" }),
});

export type Inquiry = z.infer<typeof schema>;