import Expo, { ExpoPushMessage } from "expo-server-sdk";

import { prisma } from "../generated/prisma-client";

export const expo = new Expo();
// Used if we need to slow down notifications because of rate limiting
export let NOTIFICATION_DELAY_EXP = 0;
const ticketIdToToken: { [ticketId: string]: string } = {};

export const sendNotifications = async (messages: ExpoPushMessage[]) =>
  expo.sendPushNotificationsAsync(messages).then(tickets => {
    // Save a mapping of ticket ID to pushToken. This is so we can remove any push tokens for which the
    // device cannot receive notifications any longer.
    for (let i = 0; i < tickets.length; i++) {
      const ticketId = tickets[i].id;
      const notification: ExpoPushMessage = messages[i];
      ticketIdToToken[ticketId] = notification.to;
    }

    return tickets;
  });

export const processReceipts = async (receiptIds: string[]) =>
  expo.getPushNotificationReceiptsAsync(receiptIds).then(async receipts => {
    const messageTooBigIds = [];
    for (const receiptId in receipts) {
      if (receipts.hasOwnProperty(receiptId)) {
        const receipt = receipts[receiptId];
        if (receipt.status === "ok") {
          return;
        }
        // If there are errors, attempt to handle them here.
        // TODO: Note that we don't actually retry sending the push notification(s) that failed.
        // Error documentation: https://docs.expo.io/versions/latest/guides/push-notifications/#receipt-response-format
        const error = receipt.details && receipt.details.error;
        if (error === "DeviceNotRegistered") {
          // The device cannot receive push notifications anymore. Remove the token from our database so we don't keep
          // trying.
          const token = ticketIdToToken[receiptId];
          await prisma.deletePushToken({ token });
        } else if (error === "MessageTooBig") {
          messageTooBigIds.push(receiptId);
        } else if (error === "InvalidCredentials") {
          throw new Error("Push notification credentials are invalid!");
        }
        if (error === "MessageRateExceeded") {
          // We need to slow down.
          NOTIFICATION_DELAY_EXP++;
        } else {
          NOTIFICATION_DELAY_EXP = 0;
        }
        delete ticketIdToToken[receiptId];
      }
    }
    if (messageTooBigIds && messageTooBigIds.length > 0) {
      // tslint:disable-next-line:no-console
      console.error(`${messageTooBigIds.length} push notifications were too long.`);
    }
  });
