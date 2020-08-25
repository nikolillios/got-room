import { Turn } from './Turn.model'
export class Player {
  public id: string;
  public name: string;
  public color: string;
  public isCurrPlayer: boolean;
  public turns: Array<Turn>;
  public score: number;
}