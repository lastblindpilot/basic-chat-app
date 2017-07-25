import { BasicChatAppPage } from './app.po';

describe('basic-chat-app App', () => {
  let page: BasicChatAppPage;

  beforeEach(() => {
    page = new BasicChatAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
