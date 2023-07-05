package org.ftclub.cabinet.utils.overdue.manager;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.utils.mail.EmailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class OverdueManager {

	private final EmailSender emailSender;
	private final CabinetService cabinetService;

	@Value("${spring.mail.soonoverdue.term}")
	private Long SOON_OVERDUE_TERM;

	@Value("${spring.mail.overdue.subject}")
	private String OVERDUE_MAIL_SUBJECT;

	@Value("${spring.mail.overdue.template}")
	private String OVERDUE_MAIL_TEMPLATE_URL;

	@Value("${spring.mail.soonoverdue.subject}")
	private String SOON_OVERDUE_MAIL_SUBJECT;

	@Value("${spring.mail.soonoverdue.template}")
	private String SOON_OVERDUE_MAIL_TEMPLATE_URL;

	public String getOverdueMailSubject() {
		return this.OVERDUE_MAIL_SUBJECT;
	}

	public String getOverdueMailTemplateUrl() {
		return this.OVERDUE_MAIL_TEMPLATE_URL;
	}

	public String getSoonOverdueMailSubject() {
		return this.SOON_OVERDUE_MAIL_SUBJECT;
	}

	public String getSoonOverdueMailTemplateUrl() {
		return this.SOON_OVERDUE_MAIL_TEMPLATE_URL;
	}

	public Long getSoonOverdueTerm() {
		return this.SOON_OVERDUE_TERM;
	}


	/**
	 * 연체 타입을 반환하는 메소드 연체 예정인 경우, SOON_OVERDUE를 반환하고, 연체 기간이 지난 경우, OVERDUE를 반환한다. 그 외의 경우, NONE을
	 * 반환한다.
	 *
	 * @param isExpired              연체 기간이 지났는지 여부 (true: 연체 기간이 지남, false: 연체 기간이 지나지 않음)
	 * @param daysLeftFromExpireDate 만료일까지 남은 일수
	 * @return 연체 타입
	 */
	private OverdueType getOverdueType(Boolean isExpired, Long daysLeftFromExpireDate) {
		log.info("called getOverdueType with {}, {}", isExpired, daysLeftFromExpireDate);
		if (isExpired) {
			return OverdueType.OVERDUE;
		}
		if (this.getSoonOverdueTerm().equals(daysLeftFromExpireDate)) {
			return OverdueType.SOON_OVERDUE;
		}
		return OverdueType.NONE;
	}

	public void handleOverdue(ActiveLentHistoryDto activeLent) {
		log.info("called handleOverdue with {}", activeLent);
		String subject = null, template = null;
		OverdueType overdueType = getOverdueType(activeLent.getIsExpired(),
				activeLent.getDaysLeftFromExpireDate());

		switch (overdueType) {
			case NONE:
				return;
			case SOON_OVERDUE:
				subject = getSoonOverdueMailSubject();
				template = getSoonOverdueMailTemplateUrl();
				break;
			case OVERDUE:
				this.cabinetService.updateStatus(activeLent.getCabinetId(),
						CabinetStatus.OVERDUE);
				subject = getOverdueMailSubject();
				template = getOverdueMailTemplateUrl();
				break;
		}
		try {
			this.emailSender.sendMail(activeLent.getName(), activeLent.getEmail(), subject,
					template);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}