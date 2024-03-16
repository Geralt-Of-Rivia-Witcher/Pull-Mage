import { PullRequestActionType } from '../../pull-request-event/enums/pulll-request-actions.enum';

export interface IWekhookPayload {
  action: PullRequestActionType;
  comment: {
    body: string;
  };
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
  issue: {
    number: number;
  };
  installation: {
    id: number;
  };
}
