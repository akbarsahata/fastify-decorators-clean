-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	otp varchar NOT NULL,
	created_at timestamp NOT NULL,
	modified_at timestamp NOT NULL,
	last_otp_request_at timestamp NOT NULL,
	last_otp_validation_at timestamp NOT NULL,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id)
);