import type { NotificationChannel } from './channel';
import { EmailChannel } from './emailChannel';

export type ChannelName = 'email';

/** Selects which channel the service builds at startup. */
export interface NotifierConfig {
  channel: ChannelName;
  fromAddress?: string;
}

export const DEFAULT_NOTIFIER_CONFIG: NotifierConfig = {
  channel: 'email',
  fromAddress: 'reservations@example.edu',
};

type ChannelBuilder = (config: NotifierConfig) => NotificationChannel;

const builders = new Map<ChannelName, ChannelBuilder>();

/** Adds a builder to the registry, replacing any builder under the same name. */
export function registerChannel(name: ChannelName, builder: ChannelBuilder): void {
  builders.set(name, builder);
}

/** Names the factory can currently build. */
export function registeredChannels(): ChannelName[] {
  return [...builders.keys()];
}

/** Builds the channel named by the config. */
export function createNotificationChannel(
  config: NotifierConfig = DEFAULT_NOTIFIER_CONFIG,
): NotificationChannel {
  const builder = builders.get(config.channel);
  if (builder === undefined) {
    throw new Error(`no notification channel registered under "${config.channel}"`);
  }
  return builder(config);
}

registerChannel('email', (config) => new EmailChannel(config.fromAddress));
