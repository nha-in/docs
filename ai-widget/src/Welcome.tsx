/**
 * The empty state: the orb, the greeting, and the openers as pills.
 *
 * The mock still says what it is here, under the greeting, because a panel
 * that cannot answer has to say so before anyone asks it something.
 */
import {FrostedOrb} from './orb/frosted-orb';
import type {Starter} from './starters';

type Props = {
  starters: Starter[];
  mock: boolean;
  supportUrl: string;
  onPick: (prompt: string) => void;
};

export function Welcome({starters, mock, supportUrl, onPick}: Props) {
  return (
    <div class="ask-ai__welcome">
      <FrostedOrb size={80} />
      <h3 class="ask-ai__greeting">What do you want to build today?</h3>
      {mock && (
        <p class="ask-ai__welcome-note">
          A preview, not connected to an assistant. For a real answer, use{' '}
          <a href={supportUrl} target="_blank" rel="noopener noreferrer">
            support
          </a>
          .
        </p>
      )}
      <div class="ask-ai__pills">
        {starters.map((starter, index) => (
          <button
            key={starter.prompt}
            type="button"
            class="ask-ai__pill"
            style={{animationDelay: `${400 + index * 60}ms`}}
            title={starter.prompt === starter.label ? undefined : starter.prompt}
            onClick={() => onPick(starter.prompt)}>
            {starter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
