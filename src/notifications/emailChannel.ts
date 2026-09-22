import type { NotificationChannel, NotificationResult } from './channel';

const DEFAULT_FROM_ADDRESS = 'reservations@example.edu';

/** Formats messages as email text and keeps a record of what it sent. */
export class EmailChannel implements NotificationChannel {
  readonly name = 'email';

  private readonly fromAddress: string;
  private readonly sent: string[] = [];

  constructor(fromAddress: string = DEFAULT_FROM_ADDRESS) {
    this.fromAddress = fromAddress;
  }

  send(recipient: string, subject: string, body: string): NotificationResult {
    const message = this.format(recipient, subject, body);
    this.sent.push(message);
    return {
      channel: this.name,
      recipient,
      delivered: true,
      message,
    };
  }

  /** Every message this channel has formatted so far. */
  sentMessages(): string[] {
    return [...this.sent];
  }

  private format(recipient: string, subject: string, body: string): string {
    const headers = [`From: ${this.fromAddress}`, `To: ${recipient}`, `Subject: ${subject}`];
    return `${headers.join('\n')}\n\n${body}`;
  }
}
