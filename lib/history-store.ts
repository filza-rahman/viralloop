import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamo, TABLE } from "./dynamodb"
import type { PlatformId, PlatformResult } from "./platforms"

export interface Generation {
  id: string
  idea: string
  createdAt: string
  platforms: PlatformId[]
  results: PlatformResult[]
  userId: string
}

export async function addGeneration(gen: Omit<Generation, "userId">) {
  await dynamo.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        userId: "anonymous",
        createdAt: gen.createdAt,
        id: gen.id,
        idea: gen.idea,
        platforms: gen.platforms,
        results: gen.results,
      },
    })
  )
}

export async function getGenerations(): Promise<Generation[]> {
  const res = await dynamo.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": "anonymous" },
      ScanIndexForward: false,
      Limit: 50,
    })
  )
  return (res.Items ?? []) as Generation[]
}