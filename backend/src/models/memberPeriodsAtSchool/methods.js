import MemberPeriodsAtSchool from './index';

MemberPeriodsAtSchool.findMemberPeriodsForMember = (memberId) => MemberPeriodsAtSchool.findAll({
  where: { memberId },
});
