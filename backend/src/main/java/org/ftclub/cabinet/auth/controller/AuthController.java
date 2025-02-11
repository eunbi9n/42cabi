package org.ftclub.cabinet.auth.controller;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.service.AuthFacadeService;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.FtApiProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/v4/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthFacadeService authFacadeService;
	private final DomainProperties DomainProperties;
	private final FtApiProperties ftApiProperties;

	/**
	 * 42 API 로그인 페이지로 리다이렉트합니다.
	 *
	 * @param response 요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login")
	public void login(HttpServletResponse response) throws IOException {
		authFacadeService.requestLoginToApi(response, ftApiProperties);
	}

	/*
	 * 42 API 로그인 성공 시에 콜백을 처리합니다.
	 * <br>
	 * 42 API로부터 받은 인증 코드를 이용하여 42 API에게 인증 토큰을 요청하고,
	 * <br>
	 * 인증 토큰을 이용하여 42 API에게 프로필 정보를 요청합니다.
	 * <br>
	 * 프로필 정보를 이용하여 JWT 토큰을 생성하고, JWT 토큰을 쿠키에 저장합니다.
	 * <br>
	 * 완료되면, 프론트엔드의 메인 화면으로 리다이렉트합니다.
	 *
	 * @param code 42 API로부터 쿼리로 받은 인증 코드
	 * @param req  요청 시의 서블렛 {@link HttpServletRequest}
	 * @param res  요청 시의 서블렛 {@link HttpServletResponse}
	 * @throws IOException 입출력 예외
	 */
	@GetMapping("/login/callback")
	public void loginCallback(@RequestParam String code, HttpServletRequest req,
	                          HttpServletResponse res) throws IOException {
		authFacadeService.handleLogin(code, req, res, ftApiProperties, LocalDateTime.now());
		res.sendRedirect(DomainProperties.getFeHost() + "/home");
	}

	/**
	 * 로그아웃시, HTTP Response 의 set-cookie Header 를 지워줍니다. cookie에 담긴 JWT 토큰을 제거합니다.
	 *
	 * @param res 요청 시의 서블릿 {@link HttpServletResponse}
	 */
	@GetMapping("/logout")
	public void logout(HttpServletResponse res) {
		authFacadeService.logout(res, ftApiProperties);
	}
}
