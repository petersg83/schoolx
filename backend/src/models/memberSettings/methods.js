import MemberSettings from './index';
import Member from '../member';

MemberSettings.findMemberSettingsForMember = (memberId) => MemberSettings.findAll({
  where: { memberId },
});
