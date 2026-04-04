import webpush from 'web-push';

if (process.env.VAPID_EMAIL && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushToUser(
  supabase: any,
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  if (!process.env.VAPID_PRIVATE_KEY) return;

  const { data: sub } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', userId)
    .single();

  if (!sub) return;

  try {
    await webpush.sendNotification(
      sub.subscription,
      JSON.stringify(payload)
    );
  } catch (err: any) {
    if (err.statusCode === 410) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId);
    }
  }
}
