import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(new RolesGuard()).toBeDefined();
  });
});
