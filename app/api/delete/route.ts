import { DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { dynamo, TABLE } from "@/lib/dynamodb"

export async function DELETE(req: Request) {
  try {
    const { createdAt } = await req.json()
    await dynamo.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { userId: "anonymous", createdAt },
      })
    )
    return Response.json({ success: true })
  } catch (err) {
    console.error("[viralloop] delete error:", err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}